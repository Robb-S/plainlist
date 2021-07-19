import React, { Fragment, useState } from 'react';
import '../css/lists.css';
import * as api from '../util/constants';
import { useEscape } from '../util/helpers';
import { useStore } from '../store/StoreContext';
import { handleMoveList } from '../store/handlers';
import { getOtherCats, getCatRec } from '../store/getData';
import { IconButton } from './IconButton';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';

const MoveList = ({ props }) => {
  const { cancelMove, listRec } = props;
  const { state, dispatch } = useStore();
  const [catValue, setCatValue] = useState('');
  const currentCategoryID = listRec.categoryID;
  const currentCategoryName = getCatRec(currentCategoryID, state).categoryName;
  console.log('category name: ' + currentCategoryName);
  const otherCats = getOtherCats(currentCategoryID, state);
  console.log(otherCats);

  const onSubmitMove = (e) => {
    e.preventDefault();
    onRequestMove();
  };
  const onRequestMove = async () => {
    console.log('onRequestMove');
    console.log('new cat ID: ' + catValue);
    if (catValue.length===0)  {return;}
    const newCategoryID = parseInt(catValue);
    const status = await handleMoveList(listRec.id, newCategoryID, state, dispatch);
    if (status!==api.OK) {  }
    // TODO: maybe add additional message if API operation failed?
    cancelMove();
  };
  const cancelMoveLocal = () => {
    setCatValue('');
    cancelMove();
  };
  const handleRadioChange = (e) => {
    console.log('handleRadioChange');
    console.log(e.target.value);
    setCatValue(e.target.value);
  };

  const error = true;
  useEscape(() => cancelMoveLocal());
  return (
    <Fragment>
      <div className='moveArea'>
        <div className='moveHeader'>
          Change category from {currentCategoryName} to:
        </div>
        <form className='moveCategoryForm' onSubmit={onSubmitMove}>
          <FormControl component="fieldset" error={error} >
            <RadioGroup aria-label="choose category" name="chooseCat"
              value={catValue} onChange={handleRadioChange}>
              { otherCats.map(oneCat =>
                <FormControlLabel key={oneCat.id} value={oneCat.id.toString()}
                  control={<Radio />} label={oneCat.categoryName} />,
                )
              }
            </RadioGroup>
          </FormControl>
        </form>
        <span className='editButtonArea'>
          <IconButton config={ { title:'change category',
            iconType:'confirm', callProc:onRequestMove }} />
          <IconButton config={ { title:'cancel category change',
            iconType:'cancel', callProc:cancelMoveLocal }} />
        </span>
      </div>
    </Fragment>
  );
};

export default MoveList;
