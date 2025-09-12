export const initialState = {
  selectedDate: null,
  movie: null,
  view: 'calendar',
};

export function calendarReducer(state, action) {
  switch (action.type) {
    case 'SELECT_MOVIE':
      return {
        ...state,
        selectedDate: action.payload.date,
        movie: action.payload.movie,
        view: 'movie',
      };
    case 'BACK_TO_CALENDAR':
      return {
        ...state,
        view: 'calendar',
      };
    default:
      return state;
  }
}
