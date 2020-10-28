import React from 'react';

const cartContext = React.createContext({
    items: [],
    getCart: () => { }
});

export default cartContext;