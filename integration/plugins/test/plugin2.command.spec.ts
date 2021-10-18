import { join } from 'path';
import { spawnSync } from 'child_process'

describe('Plugin Command Runner with Real Apps', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  const testApp1 = join(__dirname, '../fixtures/test-app1/src');
  const testApp2 = join(__dirname, '../fixtures/test-app2/src');
  const testCli = join(testApp1, '../../test-cli/dist/main.js');

  it('should run the phooey command as a full nest-commander cli app', (done) => {
    const { stdout, stderr } = spawnSync(
      'node',
      [testCli, 'phooey'],
      { cwd: testApp1 }
    )
    expect(stdout.toString()).toEqual('Foo!\n');
    done();
  });
  it('should not run the bar command as a full nest-commander cli app', (done) => {
    const { stderr } = spawnSync(
      'node',
      [testCli, 'bar']
    )
    expect(stderr.toString()).toContain(`error: unknown command 'bar'`);
    done();
  });

  it('should run a plugged in command from an app with a file reference in a custom named config file', (done) => {
    const { stdout, stderr } = spawnSync(
      'node',
      [testCli, 'plug'],
      { cwd: testApp1 }
    )
    expect(stdout.toString()).toEqual(`This is from the file referenced plugin!\n`);
    done();
  });

  it('should run a plugged in command from an app with a package reference in a custom named config file', (done) => {
    const { stdout, stderr } = spawnSync(
      'node',
      [testCli, 'plug'],
      { cwd: testApp2 }
    )
    expect(stdout.toString()).toEqual(`This is from the package referenced plugin!\n`);
    done();
  });

});
