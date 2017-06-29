import { BigetronAdminPage } from './app.po';

describe('bigetron-admin App', () => {
  let page: BigetronAdminPage;

  beforeEach(() => {
    page = new BigetronAdminPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
