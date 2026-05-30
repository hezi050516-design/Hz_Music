package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"hz-music/server/db"
	"math/big"
	"net/http"
	"regexp"
	"strings"
	"unicode"
)

func generateCaptcha() (question, answer string) {
	a, _ := rand.Int(rand.Reader, big.NewInt(90))
	b, _ := rand.Int(rand.Reader, big.NewInt(90))
	numA := int(a.Int64()) + 10
	numB := int(b.Int64()) + 10

	ops := []struct {
		symbol string
		calc   func(x, y int) int
	}{
		{"+", func(x, y int) int { return x + y }},
		{"-", func(x, y int) int { return x - y }},
	}

	op := ops[numA%2]
	result := op.calc(numA, numB)
	question = fmt.Sprintf("%d %s %d = ?", numA, op.symbol, numB)
	answer = fmt.Sprintf("%d", result)
	return
}

var captchaStore = make(map[string]string)

func GetCaptcha(w http.ResponseWriter, r *http.Request) {
	id := make([]byte, 8)
	rand.Read(id)
	captchaID := hex.EncodeToString(id)
	q, a := generateCaptcha()
	captchaStore[captchaID] = a
	jsonResponse(w, map[string]string{"id": captchaID, "question": q})
}

func validatePassword(pw string) string {
	if len(pw) < 6 {
		return "密码至少6位"
	}
	hasLetter := false
	hasDigit := false
	for _, c := range pw {
		if unicode.IsLetter(c) {
			hasLetter = true
		} else if unicode.IsDigit(c) {
			hasDigit = true
		} else {
			return "密码只能包含字母和数字"
		}
	}
	if !hasLetter || !hasDigit {
		return "密码需同时包含字母和数字"
	}
	return ""
}

var usernameRe = regexp.MustCompile(`^[^\s"'<>]+$`)

func Register(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Username      string `json:"username"`
		Password      string `json:"password"`
		PasswordAgain string `json:"password_again"`
		CaptchaID     string `json:"captcha_id"`
		CaptchaAnswer string `json:"captcha_answer"`
	}
	if err := jsonDecode(r, &body); err != nil {
		jsonError(w, "请求格式错误", 400)
		return
	}
	body.Username = strings.TrimSpace(body.Username)
	if body.Username == "" || len(body.Username) < 2 {
		jsonError(w, "用户名至少2位", 400)
		return
	}
	if !usernameRe.MatchString(body.Username) {
		jsonError(w, "用户名只能包含字母、数字、中文、下划线", 400)
		return
	}
	if body.Password != body.PasswordAgain {
		jsonError(w, "两次密码不一致", 400)
		return
	}
	if msg := validatePassword(body.Password); msg != "" {
		jsonError(w, msg, 400)
		return
	}
	if expected, ok := captchaStore[body.CaptchaID]; !ok || expected != body.CaptchaAnswer {
		jsonError(w, "验证码错误", 400)
		return
	}
	delete(captchaStore, body.CaptchaID)

	user, err := db.Register(body.Username, body.Password)
	if err != nil {
		jsonError(w, "服务器错误", 500)
		return
	}
	if user == nil {
		jsonError(w, "此用户名已被使用", 409)
		return
	}
	jsonResponse(w, map[string]interface{}{"id": user.ID, "username": user.Username})
}

func Login(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Username      string `json:"username"`
		Password      string `json:"password"`
		CaptchaID     string `json:"captcha_id"`
		CaptchaAnswer string `json:"captcha_answer"`
	}
	if err := jsonDecode(r, &body); err != nil {
		jsonError(w, "请求格式错误", 400)
		return
	}
	if expected, ok := captchaStore[body.CaptchaID]; !ok || expected != body.CaptchaAnswer {
		jsonError(w, "验证码错误", 400)
		return
	}
	delete(captchaStore, body.CaptchaID)

	token, ok := db.Login(body.Username, body.Password)
	if !ok {
		jsonError(w, "用户名或密码错误", 401)
		return
	}
	jsonResponse(w, map[string]string{"token": token, "username": body.Username})
}

func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
		if token == "" {
			jsonError(w, "请先登录", 401)
			return
		}
		username, ok := db.ValidateToken(token)
		if !ok {
			jsonError(w, "登录已过期", 401)
			return
		}
		r.Header.Set("X-User", username)
		next(w, r)
	}
}
