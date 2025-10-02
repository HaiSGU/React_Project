export default function CategoryCard({ img, name }) {
  return (
    <div className="card">
      <img src={img} alt={name} />
      <div>{name}</div>
    </div>
  );
}