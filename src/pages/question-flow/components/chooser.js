import React from 'react';

export default function Chooser({ choices, chosen, onChoose, children }) {
  const enhancedChoices = React.useMemo(() => {
    return choices.map((data, index) => {
      const chosenCurrent =
        typeof chosen === 'object' && chosen ? chosen.index === index : false;
      return {
        chosenCurrent,
        chosen,
        data,
        index,
        onChoose() {
          onChoose({ data, index });
        },
      };
    });
  }, [choices, chosen, onChoose]);

  return enhancedChoices.map(children);
}

Chooser.defaultProps = {
  choices: [],
};
