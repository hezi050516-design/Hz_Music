export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      className="search-bar"
      type="text"
      placeholder={placeholder || "\uD83D\uDD0D 搜索歌曲..."}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
