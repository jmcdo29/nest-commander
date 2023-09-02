export interface CompletionFactoryOptions {
  /**
   * @description Your CLI command name
   */
  cmd: string;

  /**
   * @description Support Fig completion out of the box
   * @default false
   */
  fig?: boolean;

  /**
   * @description Use native shell completion with `tab`
   * @default false
   */
  nativeShell?: false | NativeShellConfiguration;
}

export interface NativeShellConfiguration {
  executablePath: string;
}
