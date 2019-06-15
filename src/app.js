import React, { Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { GlobalStyle } from './style/global';

const QuestionSets = React.lazy(() => import('@/pages/question-sets'));

function LazyRoute({ lazy: Lazy, ...props }) {
  return (
    <Route
      {...props}
      render={routeProps => {
        return (
          <Suspense fallback={null}>
            <Lazy {...routeProps} />
          </Suspense>
        );
      }}
    />
  );
}

export default function App() {
  return (
    <>
      <GlobalStyle />

      <BrowserRouter>
        <Switch>
          <LazyRoute exact path="/question-sets" lazy={QuestionSets} />
        </Switch>
      </BrowserRouter>
    </>
  );
}
