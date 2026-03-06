export default function Topbar({ title }) {
  const now = new Date().toLocaleString();
  return (
    <header className="topbar">
      <h1>{title}</h1>
      <div className="topbar-right">
        <span>🕐 {now}</span>
      </div>
    </header>
  );
}
