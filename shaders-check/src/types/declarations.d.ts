declare module '*.png';
declare module '*.svg';
declare module '*.jpg';
declare module '*.wasm';
declare module 'qwebchannel' {
  export const enum QWebChannelMessageTypes {
    signal = 1,
    propertyUpdate = 2,
    init = 3,
    idle = 4,
    debug = 5,
    invokeMethod = 6,
    connectToSignal = 7,
    disconnectFromSignal = 8,
    setProperty = 9,
    response = 10
  }

  export type QWebChannelTransport = {
    webChannelTransport: WebSocket;
  };

  export type ApiResult = {
    connect: (callback: (arg: string) => void) => void;
    disconnect: (callback: (arg: string) => void) => void;
  };

  export type ApiResult$ = {
    handlers: (arg: string) => void[];
    subscribe: (callback: (json: string) => void) => void;
  };

  export type QObject = {
    callWalletApi: (json: string) => void;
    callWalletApiResult: ApiResult;
    apiResult$: ApiResult$;
    callApi: (callid: string, method: string, params: Params) => void;
    initializeShader: (contract: string, name: string) => void;
  };

  export type QBEAM = {
    api: QObject;
  };

  export class QWebChannel {
    constructor(
      transport: WebSocket,
      initCallback: (channel: QWebChannel) => void
    );
    objects: {
      BEAM: QBEAM;
    };
  }
}

declare module 'formProps' {
  import { FormActions } from '../constants/variables';

  export type FormDispatch = (obj: ActionTypes) => void;

  export type AddObsever = (element: BaseComponent) => void;

  export type ParamPayloadArgsType = { key:string, value: string };

  export type ActionPayloadArgsType = {
    action: string,
    params: IActionParams
  };

  export type InformArgs = {
    formAction: FormActions
    currentRole: string;
    currentAction: string;
    output: IOutput;
    currentParams: IActionParams
    dispatch: FormDispatch;
    addObserver: AddObsever;
  };
}

declare module 'beamApiProps' {
  import BaseComponent from '../components/base/base.component';

  export type APIResponse = {
    id: ReqIds;
    jsonrpc: string;
    result: {
      output: string;
      txid: string;
      txId: string;
      raw_data: number[];
      status_string: string;
      board?: BoardType;
    };
    error?: {
      code: number;
      message: string;
    };
  };

  export interface IActionParams {
    [key: string]: string;
  }

  export interface IActionOutput {
    [key: string]: never | IActionParams;
  }

  export interface IRoleOutput {
    [key: string]: IActionOutput;
  }

  export type ResponseResultType = {
    [key:string | number]: never | string | number | ResponseResultType
  };

  export interface IOutput {
    roles: IRoleOutput;
  }

  export type CallApiType = (
    callid: string,
    method: string,
    params: BeamApiParams
  ) => void;

  export type AddObserversType = (...args: BaseComponent[]) => void;

  export type InitShaderType = (shader:ArrayBuffer) => void;

  export type BeamApiHandlers = {
    callApi: CallApiType;
    addObservers: AddObserversType;
    initShader: InitShaderType;
  };

  export type BoardType = number[][];

  export type BeamApiParams = {
    contract?: number[];
    create_tx?: boolean;
    args?: string;
    data?: number[];
    txId?: string;
  };
}
