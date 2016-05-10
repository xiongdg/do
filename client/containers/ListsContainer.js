import React from 'react';
import { connect } from 'react-redux';
import Lists from '../components/Lists';
import { removeList } from '../actions/listsActions';
import { removeListId } from '../actions/boardsActions';

function mapStateToProps(state, ownProps) {
    const { lists } = state.entities;
    const listsIds = ownProps.listsIds || [];

    return {
        lists: listsIds.map(id => lists[id])
    };
};

function mapDispatchToProps(dispatch, ownProps) {
    const { boardId } = ownProps;
    return {
        onListRemoveClick: id => {
            dispatch(removeList(id))
                .then(action => {
                    if (!action.payload.error) {
                        dispatch(removeListId(boardId, id));
                    }
                });
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Lists);
