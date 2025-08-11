import React from 'react';
import MobileHeader from '../components/MobileHeader';

import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface CreateDetail {
  id: number;
  create_id: number;
  icon?: string;
  logo?: string;
  name_image?: string;
  background_color?: string;
  banner?: string;
  url?: string;
  name?: string;
}

interface HomeData {
  groupname: string;
  logo?: { logo?: string; name_image?: string } | null;
  top_icon: {
    myapps: CreateDetail[];
    myCompany: CreateDetail[];
    online: CreateDetail[];
    offline: CreateDetail[];
  };
  about_us: { id: number; image?: string; content?: string }[];
  main_ads?: { ads1?: string; ads2?: string; ads3?: string; ads1_url?: string; ads2_url?: string; ads3_url?: string } | null;
  newsroom?: any;
  awards?: any;
  event?: any;
  gallery?: any;
  testimonials: { id: number; image?: string; content?: string; title?: string; tag_line?: string }[];
  social_link: { id: number; url?: string }[];
  copy_right?: { content?: string } | null;
}

const Home: React.FC = () => {
  const { data, isLoading, error } = useQuery<HomeData>({
    queryKey: ['homeData'],
    queryFn: async () => {
      const res = await api.get('/home');
      return res.data;
    },
  });



  if (isLoading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4">Failed to load.</div>;

  return (
    <div className="container mt-3">
      {/* Mobile Header with top_myapps and header-logo */}
      <MobileHeader myapps={data?.top_icon?.myapps || []} logo={data?.logo} allTopIconData={data?.top_icon} />

      {/* Header carousel matching legacy IDs */}
      {data?.main_ads && (
        <section className="mt-3">
          <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" style={{ marginTop: '24%', marginBottom: 4 }}>
            <ol className="carousel-indicators" id="ol-carosual">
              {['ads1', 'ads2', 'ads3'].filter((k) => (data.main_ads as any)[k]).map((_, idx) => (
                <li key={idx} data-target="#carouselExampleIndicators" data-slide-to={idx} className={idx === 0 ? 'active' : ''}></li>
              ))}
            </ol>
            <div className="carousel-inner" id="carouselInner">
              {['ads1', 'ads2', 'ads3'].map((k, idx) => {
                const src = (data.main_ads as any)[k];
                const href = (data.main_ads as any)[`${k}_url`];
                if (!src) return null;
                return (
                  <div className={`carousel-item ${idx === 0 ? 'active' : ''}`} key={k}>
                    {href ? (
                      <a target="_blank" rel="noreferrer" href={href}>
                        <img className="d-block w-100" height={150} src={src} alt={k} />
                      </a>
                    ) : (
                      <img className="d-block w-100" height={150} src={src} alt={k} />
                    )}
                  </div>
                );
              })}
            </div>
            <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="sr-only">Next</span>
            </a>
          </div>
        </section>
      )}

      <section className="mt-4">
        <div className="row g-2">
          {data?.top_icon?.myapps?.map((item) => (
            <div className="col-6 col-md-3" key={`${item.id}-myapps`}>
              <a className="btn btn-outline-primary w-100 d-flex align-items-center" href={item.url || '#'}>
                {item.icon && <img src={item.icon} alt="icon" style={{ width: 20, marginRight: 8 }} />}
                <span>{item.name || 'App'}</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {data?.about_us?.length ? (
        <section className="mt-4">
          <div id="aboutCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
              {data.about_us.map((_, idx) => (
                <button key={idx} type="button" data-bs-target="#aboutCarousel" data-bs-slide-to={idx} className={idx === 0 ? 'active' : ''} aria-current={idx === 0} aria-label={`Slide ${idx+1}`}></button>
              ))}
            </div>
            <div className="carousel-inner">
              {data.about_us.map((a, idx) => (
                <div className={`carousel-item ${idx === 0 ? 'active' : ''}`} key={a.id}>
                  {a.image && <img src={a.image} className="d-block w-100" alt="about" />}
                  {a.content && <div className="carousel-caption d-none d-md-block"><p>{a.content}</p></div>}
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#aboutCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#aboutCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </section>
      ) : null}

      {data?.main_ads && (
        <section className="mt-4">
          <div id="mainAdsCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {['ads1', 'ads2', 'ads3'].map((k, idx) => {
                const src = (data.main_ads as any)[k];
                const href = (data.main_ads as any)[`${k}_url`];
                if (!src) return null;
                return (
                  <div className={`carousel-item ${idx === 0 ? 'active' : ''}`} key={k}>
                    {href ? (
                      <a href={href}><img src={src} className="d-block w-100" alt={k} /></a>
                    ) : (
                      <img src={src} className="d-block w-100" alt={k} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {data?.testimonials?.length ? (
        <section className="mt-4">
          <h5>Testimonials</h5>
          <div className="row g-3">
            {data.testimonials.map((t) => (
              <div className="col-12 col-md-6" key={t.id}>
                <div className="card">
                  {t.image && <img src={t.image} className="card-img-top" alt="testimonial" />}
                  <div className="card-body">
                    {t.content && <p className="card-text">{t.content}</p>}
                    <small className="text-muted">{t.title} {t.tag_line ? `- ${t.tag_line}` : ''}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Footer minimal */}
      <footer className="mt-5 py-4 border-top">
        <div className="d-flex justify-content-center gap-3">
          {data?.social_link?.map((s) => (
            <a key={s.id} href={s.url || '#'} target="_blank" rel="noreferrer">Link</a>
          ))}
        </div>
        <p className="text-center mt-3 mb-0">{data?.copy_right?.content || 'All Right Reserved © Mygroup of Company'}</p>
      </footer>
    </div>
  );
};

export default Home;

