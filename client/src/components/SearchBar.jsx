export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="search-bar"
      type="text"
      placeholder="\uD83D\uDD0D 搜索歌曲..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
