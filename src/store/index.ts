import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

import { calendarReducer } from './calendar/reducers';
import { CalendarState } from './calendar/types';
import { commonReducer } from './common/reducers';
import { CommonState } from './common/types';
import { settingsReducer } from './settings/reducers';
import { SettingsState } from './settings/types';
import { dialogPlanReducer } from './dialogPlan/reducers';
import { IDialogPlanState } from './dialogPlan/types';

const rootReducer = () => combineReducers({
    common: commonReducer,
    calendar: calendarReducer,
    settings: settingsReducer,
    dialogPlan: dialogPlanReducer,
});

function configureStore() {
    const middlewares: any = [thunkMiddleware];
    if (process.env.NODE_ENV === 'development') middlewares.push(logger)
    const middleWareEnhancer = applyMiddleware(...middlewares);
    const store = createStore(rootReducer(), composeWithDevTools(middleWareEnhancer));
    return store;
}

export const store = configureStore();

export interface State {
    common: CommonState;
    calendar: CalendarState;
    settings: SettingsState;
    dialogPlan: IDialogPlanState;
}