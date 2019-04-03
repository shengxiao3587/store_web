import { connect } from 'react-redux';

export default (actions, moduleName, moduleStates, View) => {
  const mapDispatchToProps = {
    ...actions,
  };
  const mapStateToProps = (state) => {
    let localState = {
      ...state[moduleName],
    };
    moduleStates.forEach((item) => {
      localState = {
        ...localState,
        [`${item.name}`]: state[`${item.value}`],
      };
    });
    return localState;
  };
  return connect(mapStateToProps, mapDispatchToProps)(View);
};
