import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class AmapComponent extends Component {
  static propTypes = {
    value: PropTypes.object,
    width: PropTypes.string,
    height: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      addressDetail: '',
      addressLngLat: [],
    };
  }

  componentDidMount() {
    if (window.AMap) {
      this.map = new window.AMap.Map('amap', {
        resizeEnable: true,
      });
    } else {
      const headNode = document.getElementsByTagName('head')[0];
      const node = document.createElement('script');
      node.type = 'text/javascript';
      node.src = 'https://webapi.amap.com/maps?v=1.3&key=cda841e2c4a1302d7cad41f84c9902a9';
      node.onload = () => {
        this.map = new window.AMap.Map('amap', {
          resizeEnable: true,
        });
      };
      headNode.appendChild(node);
    }
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps
      && nextProps.value !== undefined && nextProps.value.address !== this.state.addressDetail && window.AMap) {
      const valueAddress = nextProps.value.address;
      let city;
      window.AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], () => {
        this.placeSearch = new window.AMap.PlaceSearch({
          pageSize: 1,
          pageIndex: 1,
          map: this.map,
        });
        this.autocomplete = new window.AMap.Autocomplete();
        this.placeSearch && this.placeSearch.search(valueAddress, (status, result) => {
          if (status === 'complete' && result.info === 'OK' && result.poiList !== undefined) {
            const lng = result.poiList.pois[0].location.lng;
            const lat = result.poiList.pois[0].location.lat;
            city = result.poiList.pois[0].pname;

            this.setState(Object.assign({}, this.state, {
              addressLngLat: [lng, lat],
            }), () => {
              const obj = {
                address: this.state.addressDetail,
                lngLat: this.state.addressLngLat,
              };
              this.props.onChange(obj);
            });
          }
        });
        if (nextProps.inputDatasource !== undefined) {
          this.autocomplete && this.autocomplete.setCity({
            city: city || '北京',
          });
          const valueAddress1 = valueAddress.replace('市辖区', '');
          this.autocomplete && this.autocomplete.search(valueAddress1, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              this.props.inputDatasource(result.tips);
            } else {
              this.props.inputDatasource([{
                address: '',
                name: '无搜索项',
              }]);
            }
          });
        }
      });

      this.setState(Object.assign({}, this.state, {
        addressDetail: valueAddress,
      }), () => {
        const obj = {
          address: this.state.addressDetail,
          lngLat: this.state.addressLngLat,
        };
        this.props.onChange(obj);
      });
    }
  }

  componentWillUnmount() {
    this.setState({
      addressDetail: '',
      addressLngLat: [],
    });
  }
  render() {
    const {
      width = '400px',
      height = '255px',
    } = this.props;
    return (
      <div
        id="amap"
        style={{ width, height }}
      />
    );
  }
}
