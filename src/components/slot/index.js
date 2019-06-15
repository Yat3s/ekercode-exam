import React from 'react';

const SlotContext = React.createContext({ slots: {}, setSlots: () => {} });

export function SlotsProvider({ children }) {
  const [slots, setSlots] = React.useState({});
  const enhancedCtx = React.useMemo(() => {
    return { slots, setSlots };
  }, [slots]);

  return (
    <SlotContext.Provider value={enhancedCtx}>{children}</SlotContext.Provider>
  );
}

function useSlot(name) {
  const { slots } = React.useContext(SlotContext);
  const slot = slots[name];
  return slot;
}

export function Slot({ name }) {
  const slot = useSlot(name);

  return slot !== undefined && slot.children !== undefined
    ? slot.children
    : null;
}

export function SlotContent({ name, ...props }) {
  const { setSlots } = React.useContext(SlotContext);

  React.useEffect(() => {
    setSlots(slots => {
      const newSlots = { ...slots, [name]: props };
      return newSlots;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, ...Object.values(props)]);
  return null;
}
