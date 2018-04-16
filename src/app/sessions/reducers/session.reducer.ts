import { SearchComplete, SessionActionTypes } from "../actions/session.action";
import {AppState} from "../../app.state";

export function sessionReducer(state: AppState[] = [], action) {
  switch (action.type) {
    case SessionActionTypes.Search: {
      return {...state, loading: true};
    }
    case SessionActionTypes.SearchFailed: {
      return {...state, loading: false, error: action.payload};
    }
    case SessionActionTypes.SearchComplete: {
      return {sessions: action.payload, loading: false};
    }
    default:
      return state;
  }
}
