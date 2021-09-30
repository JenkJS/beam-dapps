import { APIResponse } from 'beamApiProps';
import { Tags } from '../../../constants/html';
import { Beam } from '../../../logic/beam/api_handler';
import BaseComponent from '../../base/base.component';
import { ReqID, ResTXStatus } from '../../../constants/api';

type WidgetPropsType = {
  value: string,
  key: keyof APIResponse['result'],
  title: string
};

export default class WidgetProps extends BaseComponent {
  value: BaseComponent;

  key: keyof APIResponse['result'];

  constructor({ value, key, title }:WidgetPropsType) {
    super(Tags.DIV, ['tx-infoblock']);
    Beam.addObservers(this);
    const titleSpan = new BaseComponent(Tags.SPAN, ['title']);
    titleSpan.innerHTML = title;
    this.value = new BaseComponent(Tags.SPAN, ['value']);
    this.key = key;
    this.value.innerHTML = value;
    this.append(titleSpan, this.value);
  }

  inform = (res: APIResponse): void => {
    if (res.id === ReqID.INVOKE_DATA) {
      if (this.key === 'txId') {
        this.value.innerHTML = window.localStorage.getItem('txId') || '...';
      }
    }
    if (res.id === ReqID.TX_STATUS) {
      this.value.innerHTML = res.result[this.key];
      if (res.result.status_string === ResTXStatus.FAILED
        || res.result.status_string === ResTXStatus.COMPLETED) {
        this.value.innerHTML = '...';
      }
    }
  };
}
