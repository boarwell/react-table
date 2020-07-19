import React from "react";
import ReactDom from "react-dom";

import "styled-jsx/style";

/**
 * 1行に必要なデータ型
 */
type SampleType = {
  name: string;
  age: number;
};

/**
 * サンプルのデータ
 */
const data: SampleType[] = [
  { name: "hoge", age: 12 },
  { name: "fuga", age: 23 },
  { name: "とっても長い名前", age: 23 },
  { name: "bob", age: 9 },
  { name: "alice", age: 45 },
];

/**
 * 表の列の設定
 */
type Columns<T> = {
  [K in keyof T]: {
    /** theadのth相当のテキスト */
    label: string;
    /**
     * 列のデータを表示用に変換する関数
     *
     * booleanをoxで表示するなど
     */
    mapper?: (value: T[K]) => React.ReactChild;
    /**
     * 列の幅。指定しなければautoに
     */
    width?: string;
    /**
     * ソート関数。Array.prototype.sort()の引数になる
     */
    compareFunction?: (a: T[K], b: T[K]) => number;
  };
};

/**
 * サンプルの列設定
 */
const columns: Columns<SampleType> = {
  name: {
    label: "名前",
  },

  age: {
    label: "年齢",
    mapper: (v) => `${v}歳`,
    compareFunction: (a, b) => a - b,
  },
};

/**
 * TableコンポーネントのProp
 */
type Prop<T> = {
  /** 列の表示設定 */
  columns: Columns<T>;
  /** 実際に表示するデータ（Tが1行になる） */
  data: T[];
};

/**
 * 表の状態
 */
type State<T> = {
  sortedBy: keyof T | null;
  sortReversed: boolean;
  data: T[];
};

type Action<T, K extends keyof T = keyof T> =
  | {
      type: "sortBy";
      payload: {
        key: K;
        compareFunction?: (a: T[K], b: T[K]) => number;
      };
    }
  | {
      type: "toggleSortOrder";
    };

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case "sortBy": {
      const { key, compareFunction } = action.payload;
      const copy = [...state.data];
      const sorted = [
        ...copy.sort((a, b) => {
          if (compareFunction) {
            return compareFunction(a[key], b[key]);
          }

          if (a[key] < b[key]) {
            return -1;
          }

          if (a[key] === b[key]) {
            return 0;
          }

          return 1;
        }),
      ];

      return {
        ...state,
        sortedBy: key,
        sortReversed: false,
        data: sorted,
      };
    }

    case "toggleSortOrder":
      {
        const copy = [...state.data];

        return {
          ...state,
          sortReversed: !state.sortReversed,
          data: [...copy.reverse()],
        };
      }

      return state;
  }
}

/**
 * Tableコンポーネント
 */
function Table<T>(prop: React.PropsWithChildren<Prop<T>>) {
  const [state, dispatch] = React.useReducer(
    function (state: State<T>, action: Action<T>) {
      // TODO: 型推論の都合でこうなってしまった。改善したい
      return reducer(state, action);
    },
    {
      sortedBy: null,
      sortReversed: false,
      data: prop.data,
    }
  );

  const { data, sortedBy, sortReversed } = state;

  const colNames = Object.keys(data[0]) as (keyof T)[];

  return (
    <table className="table">
      <thead className="rowgroup -head">
        <tr className="row -head">
          {colNames.map((colName) => {
            return (
              <th
                className="cell -th"
                onClick={() => {
                  if (sortedBy === colName) {
                    dispatch({
                      type: "toggleSortOrder",
                    });
                    return;
                  }

                  dispatch({
                    type: "sortBy",
                    payload: {
                      key: colName,
                      compareFunction: prop.columns[colName].compareFunction,
                    },
                  });
                }}
              >
                {prop.columns[colName].label}
                {sortedBy === colName ? "*" : ""}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody className="rowgroup -body">
        {data.map((row) => (
          <tr className="row -body">
            {colNames.map((colName) => {
              const mapper = prop.columns[colName].mapper ?? ((v) => v);

              return <td className="cell -td">{mapper(row[colName])}</td>;
            })}
          </tr>
        ))}
      </tbody>

      <style jsx>
        {`
          .cell.-th {
            cursor: pointer;
          }
        `}
      </style>
    </table>
  );
}

const main = () => {
  const app = document.querySelector("#app");
  if (!app) {
    return;
  }

  ReactDom.render(
    <>
      <Table data={data} columns={columns} />
    </>,
    app
  );
};

main();
