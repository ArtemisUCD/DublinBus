import {TwitterTimelineEmbed} from "react-twitter-embed";

  export default function Twitter() {
    return (
      <div  className="twitter">
        <div  className="centerContent">
          <div  className="selfCenter standardWidth">
            <TwitterTimelineEmbed
              sourceType="timeline"
              screenName="dublinbusnews"
              style={{height:"80vh"}}
            />
          </div>
        </div>
      </div>
    );
  }