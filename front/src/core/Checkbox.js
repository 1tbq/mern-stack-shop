import React, { useState } from 'react';

function Checkbox({ categories, handleFilters }) {
    const [checked, setChecked] = useState([]);




    // it a higher order function which is returing the event listner
    // the outer function is executed on the render and has the value already
    // the inner function which is the event listener gets executed on click  🙂 
    //we can also pass it to the element like this 
    //onChange={()=>handleToggle(c._id)} much easier this way

    const handleToggle = (id) => () => {
        //return the first index or -1
        const currentCategoryId = checked.indexOf(id);
        //all the ids in the array checked
        const newCheckedCategoryId = [...checked];
        //if currently checked not found push checked state
        //else remove    
        if (currentCategoryId === -1) {
            newCheckedCategoryId.push(id)
        } else {
            newCheckedCategoryId.splice(currentCategoryId, 1)
        }
        //it a higher order function the outer function is returning the 
        //event-change-listenter with which we setting the setState value
        setChecked(newCheckedCategoryId);
        //send filters to shop components
        handleFilters(newCheckedCategoryId)
    }



    return categories.map((c, i) => (
        <li key={i} className="list-unstyled">
            <input
                onChange={handleToggle(c._id)}
                value={checked.indexOf(c._id === -1)}
                type="checkbox"
                className="form-check-input"
            />
            <label className="form-check-label">{c.name}</label>
        </li>

    ));
}

export default Checkbox;