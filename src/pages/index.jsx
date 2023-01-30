import React from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

import { retext } from "retext";
import retextPos from "retext-pos";
import retextKeywords from "retext-keywords";
import { toString } from "nlcst-to-string";

async function getKeywords(text) {
  const keywords = await retext()
    .use(retextPos)
    .use(retextKeywords)
    .process(text);

  return keywords;
}

export default function Home() {
  const inputRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (data.length !== 0) {
      localStorage.setItem("notes", JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    localStorage.getItem("notes") && setData(JSON.parse(localStorage.getItem("notes")));
  }, []);


  const clickHandler = () => {
    let v = inputRef.current.value;
    let toSave = { text: v, keywords: [], timestamp: Date.now() };
    getKeywords(v)
      .then((keywords) => {
        keywords.data.keywords.forEach((keyword) => {
          toSave.keywords.push(toString(keyword.matches[0].node));
        });
        setData([toSave, ...data]);
      })
  }

  return (
    <div>
      <input ref={inputRef} type="text" id="input" />
      <button onClick={clickHandler} id="button">Submit</button>
      <Posts data={data} />
    </div>
  )
}

function Posts({ data }) {
  return (
    <div className={styles.data_container}>
      {data.map((elem, i) => (
        <div key={i + "root-div"} className={styles.data_item}>
          <p>{elem.text}</p>
          <div>{elem.keywords}</div>
        </div>
      ))}
    </div>
  )
}
