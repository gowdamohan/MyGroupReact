import React, { useState } from 'react';
import TopMyAppsMoreDialog from './TopMyAppsMoreDialog';

interface Item { id?: number; name?: string; icon?: string; url?: string }

interface Props {
  myapps: Item[];
  logo?: { logo?: string; name_image?: string } | null;
  allTopIconData?: { myapps?: Item[]; myCompany?: Item[]; online?: Item[]; offline?: Item[] };
}

const MobileHeader: React.FC<Props> = ({ myapps = [], logo, allTopIconData }) => {
  const [openMore, setOpenMore] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-dark" style={{ background: '#057284', paddingRight: 0, paddingLeft: 0 }}>
      <div style={{ position: 'relative', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {/* Fixed/absolute More button overlay on the left, like legacy */}
        <button
          className="nav-link"
          onClick={() => setOpenMore(true)}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '3rem',
            background: '#057284',
            border: 0,
            zIndex: 2,
            textAlign: 'center'
          }}
        >
          <i className="fa fa-th-large" style={{ color: '#f0e8e8' }}></i><br />
          <span style={{ fontSize: 9, color: '#f0e8e8' }}>More</span>
        </button>

        <ul
          className="navbar-nav"
          id="top_myapps"
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            padding: '0 0.5rem 0 3rem',
            margin: 0,
            whiteSpace: 'nowrap',
            gap: '1.7rem'
          }}
        >
          {myapps.map((app, i) => (
            <li
              className="nav-item text-center"
              key={`${app.name}-${i}`}
              style={{ lineHeight: 0.5, flex: '0 0 auto' }}
            >
              <a className="nav-link" href={app.url || '#'}>
                {app.icon && <img style={{ width: 20 }} src={app.icon} alt={app.name || 'app'} />}<br />
                <span style={{ fontSize: 9 }}>{app.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="header-logo" style={{ background: '#fff', width: '100%' }}>
        <div className="container">
          <div className="d-flex align-items-start justify-content-end" style={{ padding: 0 }}>
            <div className="wrapper" style={{ padding: 0 }}>
              <div className="btn" style={{ width: '100%', padding: 0 }}>
                <i style={{ fontSize: 20 }} aria-hidden="true" className="fa fa-user"></i>
              </div>
            </div>
            {logo?.name_image && (
              <a style={{ marginLeft: '0.5rem' }} href="#">
                <img className="brand-logo" style={{ width: 70 }} src={logo.name_image} alt="" />
              </a>
            )}
          </div>
        </div>
      </div>

      <TopMyAppsMoreDialog open={openMore} onClose={() => setOpenMore(false)} data={allTopIconData} />
    </nav>
  );
};

export default MobileHeader;

