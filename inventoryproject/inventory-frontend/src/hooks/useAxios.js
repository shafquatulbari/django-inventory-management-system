import { useEffect, useState } from "react";
import api from "../services/api";

const useAxios = (url, method = "GET", body = null) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (method === "GET") {
          response = await api.get(url);
        } else if (method === "POST") {
          response = await api.post(url, body);
        } else if (method === "PUT") {
          response = await api.put(url, body);
        } else if (method === "DELETE") {
          response = await api.delete(url);
        }
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, method, body]);

  return { data, error, loading };
};

export default useAxios;
