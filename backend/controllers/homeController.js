const { sequelize } = require('../models');

// Public Home data aggregator matching legacy Home::index requirements
// Uses raw SQL to avoid relying on incomplete Sequelize models for legacy tables
async function getHomeData(req, res) {
  try {
    const queries = {
      logo: "SELECT logo, name_image FROM `group` ORDER BY id ASC LIMIT 1",
      myapps: "SELECT gc.name, cd.* FROM group_create gc JOIN create_details cd ON gc.id = cd.create_id WHERE gc.apps_name = 'My Apps' ORDER BY gc.id",
      myCompany: "SELECT gc.name, cd.* FROM group_create gc JOIN create_details cd ON gc.id = cd.create_id WHERE gc.apps_name = 'My Company' ORDER BY gc.id",
      online: "SELECT gc.name, cd.* FROM group_create gc JOIN create_details cd ON gc.id = cd.create_id WHERE gc.apps_name = 'My Onine Apps' ORDER BY gc.id",
      offline: "SELECT gc.name, cd.* FROM group_create gc JOIN create_details cd ON gc.id = cd.create_id WHERE gc.apps_name = 'My Offline Apps' ORDER BY gc.id",
      about_us: 'SELECT id, group_id, image, content FROM about WHERE group_id = 0 ORDER BY id ASC',
      main_ads: 'SELECT id, ads1, ads2, ads3, ads1_url, ads2_url, ads3_url FROM main_ads ORDER BY id DESC LIMIT 1',
      newsroom: 'SELECT * FROM newsroom ORDER BY id DESC LIMIT 1',
      awards: 'SELECT * FROM awards ORDER BY id DESC LIMIT 1',
      events: 'SELECT * FROM events ORDER BY id DESC LIMIT 1',
      gallery: 'SELECT * FROM gallery_images_master ORDER BY image_id DESC LIMIT 1',
      testimonials: 'SELECT * FROM testimonials ORDER BY id DESC LIMIT 4',
      social_link: 'SELECT * FROM social_link WHERE group_id = 0 ORDER BY id ASC',
      copy_right: 'SELECT * FROM copy_rights ORDER BY id DESC LIMIT 1',
    };

    const [logoRows] = await sequelize.query(queries.logo);
    const logo = (logoRows && logoRows[0]) || null;

    const [myapps] = await sequelize.query(queries.myapps);
    const [myCompany] = await sequelize.query(queries.myCompany);
    const [online] = await sequelize.query(queries.online);
    const [offline] = await sequelize.query(queries.offline);

    const [about_us] = await sequelize.query(queries.about_us);

    const [mainAdsRows] = await sequelize.query(queries.main_ads);
    const main_ads = (mainAdsRows && mainAdsRows[0]) || null;

    const [newsroomRows] = await sequelize.query(queries.newsroom);
    const newsroom = (newsroomRows && newsroomRows[0]) || null;

    const [awardsRows] = await sequelize.query(queries.awards);
    const awards = (awardsRows && awardsRows[0]) || null;

    const [eventsRows] = await sequelize.query(queries.events);
    const event = (eventsRows && eventsRows[0]) || null;

    const [galleryRows] = await sequelize.query(queries.gallery);
    const gallery = (galleryRows && galleryRows[0]) || null;

    const [testimonials] = await sequelize.query(queries.testimonials);
    const [social_link] = await sequelize.query(queries.social_link);

    const [copyRightRows] = await sequelize.query(queries.copy_right);
    const copy_right = (copyRightRows && copyRightRows[0]) || null;

    res.json({
      groupname: 'Mygroup',
      logo,
      top_icon: { myapps, myCompany, online, offline },
      about_us,
      main_ads,
      newsroom,
      awards,
      event,
      gallery,
      testimonials,
      social_link,
      copy_right,
    });
  } catch (error) {
    console.error('Home data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getHomeData };

