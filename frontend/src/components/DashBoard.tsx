import React, { ChangeEvent, useEffect, useState } from "react";
import { LogoutButton } from "./Logout";
import axios from "axios";
import { URLs } from "./URLs";
import {
  DashBoardAnalyticsProps,
  DashBoardProps,
  URLProps,
} from "../utils/interfaces";
import { FilterIcon } from "../icons/filter";
import { URLForm } from "./URLForm";
import { useRecoilState, useSetRecoilState } from "recoil";
import { urlAtom, URLServerError } from "../store/atom";

export const DashBoard: React.FC<DashBoardProps> = (props) => {
  const { username } = props;
  const [showForm, setShowForm] = useState<boolean>(false);
  const [dashBoardAnalytics, setDashBoardAnalytics] =
    useState<DashBoardAnalyticsProps>({
      TotalClicks: 0,
      numberOfLinks: 0,
    });
  const [urls, setUrls] = useRecoilState(urlAtom);
  const [originalUrls, setOriginalUrls] = useState<URLProps[]>([]);
  const [noResultFound, setNoResultFound] = useState<boolean>(false);
  const setServerError = useSetRecoilState(URLServerError);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get("http://localhost:8080/api/url", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashBoardAnalytics({
          TotalClicks: response.data.totalClicks,
          numberOfLinks: response.data.numberOfLinks,
        });
        setUrls(response.data.urls);
        setOriginalUrls(response.data.urls);
      } catch (err: any) {
        console.log(err);
      }
    };

    fetchUrls();
  }, []);

  const filterComponents = (e: ChangeEvent<HTMLInputElement>) => {
    // filtering by title
    const inputText = e.target.value.toLowerCase();
    const filterLinks = originalUrls.filter((url) => {
      return url.title.toLowerCase().includes(inputText);
    });

    if (originalUrls.length === 0) {
      setNoResultFound(false);
      return;
    }

    if (filterLinks.length === 0) {
      setNoResultFound(true);
    } else {
      setNoResultFound(false);
    }

    setUrls(inputText.length !== 0 ? filterLinks : originalUrls);
  };

  const handleSubmit = async (newURL: Partial<URLProps>) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        "http://localhost:8080/api/url",
        newURL,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setServerError("");
      setOriginalUrls((prevUrls) => [...prevUrls, response.data]);
      setUrls((prevUrls) => [...prevUrls, response.data]);
      setShowForm(false);
    } catch (err: any) {
      setServerError(err.response.data.error);
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="ml-32 mt-5 text-4xl">Welcome to the Dashboard!</h1>
          <span className="ml-32">{username}</span>
        </div>

        <div className="mr-16 border border-solid border-black p-2 mt-5 rounded mb-16">
          <LogoutButton />
        </div>
      </div>

      <div className="flex">
        <div className="w-1/2 flex justify-center p-5 border ml-16 border-black rounded">
          <h1>Links Created &nbsp;: &nbsp;</h1>
          <p>{dashBoardAnalytics.numberOfLinks}</p>
        </div>

        <div className="w-1/2 flex justify-center p-5 border ml-10 mr-16 border-black rounded">
          <h1>Total Clicks &nbsp;: &nbsp;</h1>
          <p>{dashBoardAnalytics.TotalClicks}</p>
        </div>
      </div>

      <div className="mr-16 mt-10 flex justify-between">
        <div className="text-4xl ml-16">My Links</div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="border border-solid border-black p-2 rounded"
        >
          Create New
        </button>
      </div>

      <div className="flex justify-between items-center border border-black mt-10 ml-16 mr-16 rounded">
        <input
          type="text"
          placeholder="Filter Links... "
          className=" ml-6 p-2 border-none focus:outline-none w-full"
          onChange={filterComponents}
        />
        <div className="mr-16">
          <FilterIcon />
        </div>
      </div>
      <div>
        <div>
          {noResultFound ? (
            <div className="ml-16 mt-10 text-5xl font-bold">
              Oops, No Result Found
            </div>
          ) : (
            urls.map((url: URLProps) => {
              return <URLs {...url} key={url.id} />;
            })
          )}
        </div>
      </div>

      {showForm && (
        <URLForm
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setServerError("");
          }}
        />
      )}
    </div>
  );
};
