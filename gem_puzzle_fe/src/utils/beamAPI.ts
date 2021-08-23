import { BeamApiParams } from 'beamApiProps';
import { QWebChannel, QWebChannelTransport, QObject } from 'qwebchannel';
import shader from '../app.wasm';
import { ApiId, APIMethods, AppSpecs } from '../constants/api_constants';

declare global {
  interface Window {
    qt: QWebChannelTransport;
    beam: QObject;
  }
}

export class BeamAPI {
  private API: null | QObject;

  private contract: ArrayBuffer | null;

  private readonly observers: any[];

  constructor() {
    this.API = null;
    this.contract = null;
    this.observers = [];
  }

  addObservers = (...components: any[]): void => {
    components.forEach((component) => {
      this.observers.push(component);
    });
  };

  onApiResult = (json: string): void => {
    console.log(json);
    this.observers.forEach((element: any) => {
      element.inform(
        {
          initShader: this.initShader,
          callApi: this.callApi
        },
        JSON.parse(json)
      );
    });
  };

  loadAPI = async (): Promise<void> => {
    const { qt, beam } = window;
    if (beam) {
      window.beam.apiResult$.subscribe(this.onApiResult);
      this.API = beam;
    } else {
      this.API = (await new Promise<QObject>(
        (resolve) => new QWebChannel(
          qt.webChannelTransport, (channel) => {
            resolve(channel.objects.BEAM.api);
          }
        )
      ));
      this.API?.callWalletApiResult.connect(this.onApiResult);
    }
    this.contract = await fetch(shader).then((response) => response.arrayBuffer());
    if (this.contract) {
    this.callApi(ApiId.CHECK, APIMethods.INVOKE_CONTRACT, {
      contract: Array.from(new Uint8Array(this.contract)),
      create_tx: false,
      args: 'role=manager,action=view_contracts'
    });
  }
  };

  initShader = (shader:ArrayBuffer):void => {
    this.contract = shader;
    if (window.beam) {
      window.beam.initializeShader(
        AppSpecs.CID,
        AppSpecs.TITLE
      );
    }
  };

  callApi = (callid: string, method: string, params: BeamApiParams): void => {
    if (this.contract) {
      const contract = Array.from(new Uint8Array(this.contract));
      const request = {
        jsonrpc: '2.0',
        id: callid,
        method,
        params: { ...params, contract }
      };
      if (window.beam) {
        window.beam.callApi(callid, method, { ...params, contract });
      } else {
        this.API?.callWalletApi(JSON.stringify(request));
      }
    }
  };
}