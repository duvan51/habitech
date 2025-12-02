import { useEffect, useState } from "react";

export function useDataSdk(maxRecords = 999) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (!window || !window.dataSdk) return;

    (async () => {
      const handler = {
        onDataChanged(data) {
          setRecords(Array.isArray(data) ? data : []);
        }
      };

      await window.dataSdk.init(handler);
    })();
  }, []);

  async function createRecord(record) {
    if (!window || !window.dataSdk) {
      return { isOk: false, reason: "no-data-sdk" };
    }

    if (records.length >= maxRecords) {
      return { isOk: false, reason: "max-reached" };
    }

    const res = await window.dataSdk.create(record);
    return res;
  }

  return { records, createRecord };
}
