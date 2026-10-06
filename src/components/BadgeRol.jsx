import roles from "../data/roles.json";

export default function BadgeRol({ rol }) {
  const config = roles[rol];
  return (
    <span className={`role-badge role-${config.slug}`} title={rol}>
      <i className={`bi ${config.icono}`} aria-hidden="true"></i>
      <span className="d-none d-sm-inline">{rol}</span>
    </span>
  );
}
