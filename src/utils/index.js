import { Link } from 'react-router-dom';

export const currencyFormat = (value) => {
    return new Intl.NumberFormat(`en-US`, {
        currency: `USD`,
        style: 'currency',
    }).format(value);
};

export const NavLink = ({ children, href, ...atts }) => (
  <Link to={href} data-rr-ui-event-key={href} className="nav-link" {...atts} >{children}</Link>
);

export const monthMap = {};
[...Array(12)].keys().forEach(key => {
  monthMap[key] = new Date(2024, key, 1).toLocaleString('default', { month: 'long' });
});
