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
 * Tableコンポーネント
 */
function Table<T>(prop: React.PropsWithChildren<Prop<T>>) {
  const [data, setData] = React.useState(prop.data);
  const [sortedBy, setSortedBy] = React.useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"ASC" | "DESC">(
    "ASC"
  );

  const colNames = Object.keys(prop.data[0]) as (keyof T)[];

  return (
    <table className="table">
      <thead className="rowgroup -head">
        <tr className="row -head">
          {colNames.map((colName) => {
            return (
              <th
                className="cell -th"
                onClick={() => {
                  setSortedBy(colName);
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
