// Using internal Docker network for API calls
import {environment} from '../../environments/environment';

export const apiConst = {
  baseUrl: environment.apiUrl
}
