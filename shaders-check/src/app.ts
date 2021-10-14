import { BeamAPI } from './logic/beam/BeamAPI';
import './scss/main.scss';
import { BEAM } from './controllers/beam.controller';
import Main from './components/main/main.component';
import Loader from './components/shared/loader/loader.component';
import { Store } from './logic/store/store.logic';
import { STORE } from './controllers/store.controller';

export class App {
  constructor(rootElement: HTMLElement) {
    const beam = new BeamAPI();
    const store = new Store();
    const loader = new Loader();
    rootElement.append(loader.element);

    beam.loadAPI().then((data:BeamAPI) => {
      STORE.setApiHandlers({
        addObserver: store.addObserver,
        dispatch: store.dispatch,
        getRole: store.getRole
      });
      BEAM.setApiHandlers({
        addObservers: data.addObservers,
        callApi: data.callApi,
        initShader: data.initShader,
        deleteObserver: data.deleteObserver
      });
      loader.replace(new Main());
    });
  }
}
