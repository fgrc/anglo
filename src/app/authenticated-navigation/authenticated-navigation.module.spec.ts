import { AuthenticatedNavigationModule } from './authenticated-navigation.module';

describe('AuthenticateNavigationModule', () => {
  let authenticateNavigationModule: AuthenticatedNavigationModule;

  beforeEach(() => {
    authenticateNavigationModule = new AuthenticatedNavigationModule();
  });

  it('should create an instance', () => {
    expect(authenticateNavigationModule).toBeTruthy();
  });
});
