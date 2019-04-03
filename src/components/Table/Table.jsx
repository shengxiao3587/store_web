import React, { Component } from 'react';
import { Table as AntdTable, Spin } from 'antd';
import PropTypes from 'prop-types';
import './table.scss';

export default class Table extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.array,
    rowSelection: PropTypes.object,
    pagination: PropTypes.object,
    search: PropTypes.func,
    searchParams: PropTypes.object,
    onChange: PropTypes.func,
    bordered: PropTypes.bool,
    expandedRowRender: PropTypes.func,
  }

  onChange(page) {
    this.props.search({
      ...this.props.searchParams,
      pageNo: page.current,
      pageSize: page.pageSize,
    });
  }

  render() {
    const {
      loading,
      columns,
      dataSource,
      pagination,
      searchParams,
      rowSelection,
      onChange,
      bordered,
      expandedRowRender,
      tableRowKey,
      className,
    } = this.props;

    const mapColumns = [
      ...columns,
    ];

    mapColumns.forEach((columnTemp) => {
      const column = columnTemp;
      if ('label' in column) {
        column.title = column.label;
      }
      if ('name' in column) {
        column.dataIndex = column.name;
        column.key = column.dataIndex;
      }
      if (!('render' in column)) {
        column.render = (text) => ((text === '' || typeof text === 'undefined') ? '-' : text);
      }
    });

    return (
      <Spin spinning={loading}>
        <AntdTable
          className={className}
          bordered={bordered}
          searchParams={searchParams}
          rowKey={tableRowKey || 'id'}
          columns={mapColumns}
          dataSource={dataSource}
          pagination={
            pagination ? {
              pageSize: 10,
              ...pagination,
              showTotal: (total, range) => `显示第 ${range[0]} 到第 ${range[1]} 条记录，总共 ${total} 条记录`,
            } : false}
          onChange={onChange || this.onChange.bind(this)}
          rowSelection={rowSelection}
          expandedRowRender={expandedRowRender}
        />
      </Spin>
    );
  }
}
