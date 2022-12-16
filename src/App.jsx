import { useEffect, useState } from "react";
import "./App.scss";

console.clear();

const timeAgo = (time) => {
  let time_ago = new Date() / 1000 - time;
  let time_text = "s";
  if (time_ago >= 60) {
    time_ago = time_ago / 60;
    time_text = "m";
    if (time_ago >= 60) {
      time_ago = time_ago / 60;
      time_text = "h";
      if (time_ago >= 24) {
        time_ago = time_ago / 24;
        time_text = "d";
        if (time_ago >= 30.437) {
          time_ago = time_ago / 30.437;
          time_text = "M";
          if (time_ago >= 12) {
            time_ago = time_ago / 12;
            time_text = "Y";
          }
        }
      }
    }
  }
  return `${time_ago.toFixed(1)}${time_text}`;
};

const Loading = () => {
  const [loading, setLoading] = useState("Loading");

  useEffect(() => {
    let count = 0;
    setInterval(() => {
      count++;
      setLoading(
        `Loading${Array((count % 3) + 1)
          .fill(".")
          .join("")}`
      );
    }, 250);
  }, []);

  return <div className="loading">{loading}</div>;
};

const ChevronUpIcon = () => (
  <svg
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <polyline points="6 15 12 9 18 15"></polyline>
  </svg>
);
const PercentageIcon = () => (
  <svg
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <circle cx="17" cy="17" r="1"></circle>
    <circle cx="7" cy="7" r="1"></circle>
    <line x1="6" y1="18" x2="18" y2="6"></line>
  </svg>
);
const CommentIcon = () => (
  <svg
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4"></path>
    <line x1="8" y1="9" x2="16" y2="9"></line>
    <line x1="8" y1="13" x2="14" y2="13"></line>
  </svg>
);
const ClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <circle cx="12" cy="12" r="9"></circle>
    <path d="M12 12l3 2"></path>
    <path d="M12 7v5"></path>
  </svg>
);

const Post = ({ postData, IsActivePost }) => {
  const imgSrcSet =
    postData.data.post_hint === "image" &&
    postData.data.preview.images[0].resolutions
      .map((e) => {
        return `${e.url} ${e.width}w`;
      })
      .join(",");
  const bgImgUrl =
    postData.data.post_hint === "image" &&
    `url("${postData.data.preview.images[0].resolutions[0].url}")`;

  const handelClick = () => {
    console.log(postData.data);
  };

  return (
    <div
      className={IsActivePost ? "post active" : "post"}
      onClick={handelClick}
    >
      <div className="meta_info">
        {postData.data.post_hint ? (
          <div className="hint">{postData.data.post_hint}</div>
        ) : (
          ""
        )}
        <div className="in_subreddit">
          <div className="text">in</div>
          <a href="#" className="subreddit">
            r/{postData.data.subreddit}
          </a>
        </div>
        <div className="by_author">
          <div className="text">by</div>
          <a href="#" className="author">
            u/{postData.data.author}
          </a>
        </div>
      </div>
      <div className="title">{postData.data.title}</div>
      {postData.data.post_hint === "image" ? (
        <div className="image" style={{ backgroundImage: bgImgUrl }}>
          <img srcSet={imgSrcSet} alt="" />
        </div>
      ) : (
        ""
      )}
      {postData.data.post_hint === "link" ? (
        <a href={postData.data.url} className="link">
          {postData.data.url}
        </a>
      ) : (
        ""
      )}
      <div className="numbers_info">
        <div className="score">
          <ChevronUpIcon />
          {postData.data.score}
        </div>
        <div className="ratio">
          <PercentageIcon />
          {postData.data.upvote_ratio * 100}%
        </div>
        <div className="comments">
          <CommentIcon />
          {postData.data.num_comments}
        </div>
        <div className="time_passed">
          <ClockIcon />
          {timeAgo(postData.data.created)}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const url = "https://www.reddit.com/.json?raw_json=1";

  const [postsData, setPostsData] = useState([]);
  const [after, setAfter] = useState(null);
  const [IsLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFunction = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setPostsData(json.data.children);
        setIsLoading(false);
        setAfter(json.data.after);
      } catch (error) {
        setError(error);
      }
    };
    fetchFunction();
  }, []);

  const [IsLoadingMoreItems, setIsLoadingMoreItems] = useState(false);
  const fetchMoreItems = async () => {
    try {
      const response = await fetch(
        `https://www.reddit.com/.json?after=${after}&raw_json=1`
      );
      const json = await response.json();
      setAfter(json.data.after);
      json.data.children.forEach((newFetchedPost) => {
        setPostsData((prev) => [...prev, newFetchedPost]);
      });
      setIsLoadingMoreItems(false);
    } catch (error) {
      setError(error);
    }
  };
  useEffect(() => {
    window.onscroll = () => {
      if (
        window.scrollY > 1000 &&
        window.innerHeight +
          window.scrollY -
          document.body.scrollHeight +
          500 >=
          0 &&
        !IsLoadingMoreItems
      ) {
        setIsLoadingMoreItems(true);
      }
    };
  }, []);
  useEffect(() => {
    if (IsLoadingMoreItems) {
      fetchMoreItems();
    }
  }, [IsLoadingMoreItems]);

  const [IsActivePost, setIsActivePost] = useState(-1);
  useEffect(() => {
    document.body.onkeydown = (key) => {
      if (key.key === "f") {
        setIsActivePost((prev) => {
          if (prev <= document.querySelectorAll(".post").length) {
            return prev + 1;
          } else {
            return prev;
          }
        });
      }
      if (key.key === "r") {
        setIsActivePost((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            return prev;
          }
        });
      }
    };
  }, []);

  useEffect(() => {
    console.log(IsActivePost);
    document.querySelector(".post.active").scrollIntoView();
  }, [IsActivePost]);

  return (
    <div className="app">
      {IsLoading ? (
        <Loading />
      ) : (
        <div className="posts">
          {postsData.map((postData, postIndex) => {
            return (
              <Post
                key={postIndex}
                postData={postData}
                IsActivePost={postIndex === IsActivePost ? true : false}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default App;
