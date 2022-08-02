import {TwitterTimelineEmbed} from "react-twitter-embed";

  export default function Twitter() {
    return (
      <div className="twitter">
        <div className="centerContent">
          <div className="selfCenter standardWidth">
            <TwitterTimelineEmbed
              sourceType="timeline"
              screenName="dublinbusnews"
              options={{ height: 400 }}
            />
          </div>
        </div>
      </div>
    );
  }