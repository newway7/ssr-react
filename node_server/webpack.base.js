module.exports = {
  module: {
    rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options:{
            presets:['@babel/preset-react',['@babel/preset-env',{
             targets:{
                browsers :["> 1%",'last 10 versions','not ie <= 8']
             }   
            }]

            ],
            plugins: [
                "@babel/plugin-proposal-function-bind",
                "@babel/plugin-proposal-class-properties","@babel/plugin-transform-runtime"
               
              ]
    }
    }]
}
}