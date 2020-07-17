import React from "react";
import ReactDom from "react-dom";

type SampleType = {
  name: string;
  age: number;
};

const data: SampleType[] = [
  { name: "hoge", age: 12 },
  { name: "fuga", age: 23 },
];

type Columns<T> = {
  [K in keyof T]: {
    label: string;
    mapper?: (value: T[K]) => React.ReactChild;
    width?: string;
  };
};

const columns: Columns<SampleType> = {
  name: {
    label: "名前",
  },

  age: {
    label: "年齢",
    mapper: (v) => `${v}歳`,
  },
};

type Prop<T> = {
  columns: Columns<T>;
  data: T[];
};

function Table<T>(prop: React.PropsWithChildren<Prop<T>>) {
  const colNames = Object.keys(prop.data[0]) as (keyof T)[];

  return (
    <div className="table">
      <div className="row -heading" style={{ display: "flex" }}>
        {colNames.map((colName) => {
          return <div className="cell">{prop.columns[colName].label}</div>;
        })}
      </div>

      {prop.data.map((row) => (
        <div
          className="row"
          style={{
            display: "flex",
          }}
        >
          {colNames.map((colName) => {
            const mapper = prop.columns[colName].mapper ?? ((v) => v);

            return <div className="cell">{mapper(row[colName])}</div>;
          })}
        </div>
      ))}
    </div>
  );
}

const main = () => {
  const app = document.querySelector("#app");
  if (!app) {
    return;
  }

  ReactDom.render(<Table data={data} columns={columns} />, app);
};

main();
