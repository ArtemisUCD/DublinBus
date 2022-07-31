import {
    TwitterTimelineEmbed,
  } from "react-twitter-embed";
  export default function Twitter() {
    return (
      <div className="App">
        <div className="centerContent">
          <div className="selfCenter standardWidth">
            <TwitterTimelineEmbed
              sourceType="timeline"
              screenName="dublinbusnews"
              options={{ height: 600 }}
            />
          </div>
        </div>
      </div>
    );
  }