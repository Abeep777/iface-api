// Your PAT (Personal Access Token) can be found in the Account's Security section
const PAT = process.env.PAT;

// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = "devap";
const APP_ID = "iface";

// Change these to whatever model and image URL you want to use
const MODEL_ID = "face-detection";

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

// This will be used by every Clarifai endpoint call
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

const handleClarifaiApiCall = (req,res) => {
  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      model_id: MODEL_ID,
      inputs: [
        {
          data: {
            image: {
              url: req.body.input,
              allow_duplicate_url: true,
            },
          },
        },
      ],
    },
    metadata,
    (err, response) => {
      if (err) {
        throw new Error(err);
      }

      if (response.status.code !== 10000) {
        throw new Error(
          "Post model outputs failed, status: " + response.status.description
        );
      }
      res.json(response)
    }
  );
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("Unable to get entries"));
};

module.exports = {
  handleImage: handleImage,
  handleClarifaiApiCall: handleClarifaiApiCall
};
