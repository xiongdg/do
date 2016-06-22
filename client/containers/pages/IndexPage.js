import React, { PropTypes, Component } from 'react';
import cookie from 'js-cookie';
import { connect } from 'react-redux';
import modalsNames from '../../constants/modalsNames';
import BoardsList from '../../components/BoardsList.js';
import Loader from '../../components/Loader';
import BottomBox from '../../components/BottomBox';
import Btn from '../../components/Btn';
import Animation from '../../components/Animation';
import { fetchBoards, removeBoard, updateBoard } from '../../actions/boardsActions';
import { showModal } from '../../actions/modalActions';

class IndexPage extends Component {
  constructor(props) {
    super(props);

    this.handleAddBoardBtnClick = this.handleAddBoardBtnClick.bind(this);
    this.handleBoardTileEditClick = this.handleBoardTileEditClick.bind(this);
    this.handleBoardTileRemoveClick = this.handleBoardTileRemoveClick.bind(this);
    this.handleBoardTileToggleStarredClick = this.handleBoardTileToggleStarredClick.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchBoards.request());
  }

  shouldComponentUpdate(nextProps) {
    return !(!this.props.isFetching && !this.props.lastUpdated && nextProps.isFetching);
  }

  handleAddBoardBtnClick() {
    this.props.dispatch(
      showModal(modalsNames.CREATE_BOARD)
    );
  }

  handleBoardTileEditClick(boardId) {
    this.props.dispatch(
      showModal(modalsNames.EDIT_BOARD, {
        boardId,
      })
    );
  }

  handleBoardTileRemoveClick(id) {
    this.props.dispatch(removeBoard.request({ id }));
  }

  handleBoardTileToggleStarredClick(id, starred) {
    this.props.dispatch(
      updateBoard.request({ id, props: { starred: !starred } })
    );
  }

  handleGroupTitleClick(groupTitle, isActive) {
    const name = `${groupTitle}_accordion_hidden`;
    if (!isActive) {
      cookie.set(name, true);
    } else {
      cookie.remove(name);
    }
  }

  render() {
    const {
      groups,
      isFetching,
      lastUpdated,
      error,
    } = this.props;

    const isEmpty = groups.length === 0;

    const addBoardBtn = (
      <Btn
        text="Add new board"
        onClick={this.handleAddBoardBtnClick}
      />
    );

    return (
      <div>
        {error ? (
          <div>Error loading boards.</div>
        ) : isEmpty ? (
          <div>No result.</div>
        ) : isFetching || !lastUpdated ? (
          <Loader />
        ) : (
          <BoardsList
            groups={groups}
            onBoardTileRemoveClick={this.handleBoardTileRemoveClick}
            onBoardTileEditClick={this.handleBoardTileEditClick}
            onBoardTileToggleStarredClick={this.handleBoardTileToggleStarredClick}
            onGroupTitleClick={this.handleGroupTitleClick}
          />
        )}
        <BottomBox
          button={addBoardBtn}
        />
      </div>
    );
  }
}

IndexPage.propTypes = {
  groups: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  error: PropTypes.bool,
};

function mapStateToProps(state) {
  const { boards } = state.entities;
  const { ids, isFetching, lastUpdated, error } = state.pages.main;
  const items = ids.map(id => boards[id]);

  return {
    groups: [
      getGroupObject('Starred boards', items.filter(b => b.starred)),
      getGroupObject('My boards', items),
    ],
    isFetching,
    lastUpdated,
    error,
  };
}

function getGroupObject(title, boards) {
  return {
    hidden: cookie.get(`${title}_accordion_hidden`),
    title,
    boards,
  };
}

export default connect(
  mapStateToProps
)(IndexPage);