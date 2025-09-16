# Kisaan Mitra - Smart Farming & Weather Intelligence

A production-ready, responsive web application providing comprehensive weather monitoring, soil condition analysis, and intelligent crop suggestions across India.

## 🌟 Features

### Mul## 🆘 Support

For issues and questions:
1. Check the [GitHub Issues](https://github.com/nishil61/Kisaan-Mitra/issues) page
2. Review API documentation links above
3. Ensure all environment variables are set correctly
4. Verify API key quotas and permissions

---

**Powered by Kisaan Mitra – Your Trusted Companion for Smart Farming & Weather Intelligence** 🌾👨‍🌾🤝eather Integration
- **🌐 Real-Time Data**: Live weather from OpenWeatherMap and WeatherAPI
- **🔄 Smart Fallback**: Automatic failover between multiple APIs
- **🌱 Soil Data**: Real soil moisture from Open-Meteo API
- **📊 High Reliability**: 95% accuracy with real-time data
- **🎛️ Data Source Toggle**: Switch between live and mock data
- **⚡ Smart Caching**: 10-minute cache for optimal performance

### Intelligent Crop Suggestions
- **🌾 70+ Indian Crops**: Comprehensive database of cereals, pulses, oilseeds, vegetables, fruits, spices, and cash crops
- **🎯 Smart Recommendations**: AI-powered crop suggestions based on current weather and soil conditions
- **📈 Confidence Scoring**: Each crop suggestion includes confidence rating and success probability
- **🌡️ Climate Matching**: Temperature, humidity, and rainfall requirements for optimal crop selection
- **💡 Agricultural Tips**: Seasonal guidance and best practices for selected crops

### Soil Condition Monitoring
- Real-time soil moisture and temperature tracking
- Agricultural recommendations based on current conditions
- Irrigation alerts and optimal sowing guidance
- Evapotranspiration analysis

### Location Coverage
- **🗺️ 3,180+ Locations**: Comprehensive coverage of Indian cities, districts, and villages
- Search by village name, district, or PIN code
- GPS-based automatic location detection
- Recent locations history
- Complete coverage of all Indian states and union territories

### Predictive Analytics
- 14-day weather forecasting
- Soil moisture trend prediction
- Interactive charts for temperature, rainfall, and soil conditions
- ML-driven agricultural insights

## 🌐 Weather Data Sources

This application supports both **real-time** and **mock** weather data:

### Real-Time Mode (Default):
- ✅ Live data from OpenWeatherMap & WeatherAPI  
- ✅ Real soil moisture from Open-Meteo
- ✅ 95% reliability score
- ✅ Updates every 10 minutes

### Mock Mode (Fallback):
- ✅ Consistent location-based simulation
- ✅ Seasonal weather patterns  
- ✅ 88% reliability score
- ✅ Perfect for testing/demos

**Toggle between modes** using the data source button in the top-right corner!

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS
- **Animation**: Framer Motion
- **Charts**: Recharts  
- **Icons**: Lucide React
- **Backend**: Vercel Serverless Functions
- **APIs**: OpenWeatherMap, WeatherAPI, Open-Meteo, Nominatim Geocoding
- **Caching**: In-memory caching with 10-minute refresh
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/nishil61/Kisaan-Mitra.git
cd Kisaan-Mitra
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Get your API keys:
   - [OpenWeatherMap](https://openweathermap.org/api) - Free tier: 1,000 calls/day
   - [WeatherAPI](https://www.weatherapi.com/) - Free tier: 1 million calls/month
   - [OpenCage Geocoding](https://opencagedata.com/api) - Free tier: 2,500 requests/day (Optional - fallback database included)

5. Update `.env` with your API keys:
```env
OPENWEATHER_API_KEY=your_key_here
WEATHERAPI_KEY=your_key_here
OPENCAGE_API_KEY=your_key_here
```

## 🖥️ Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production
Set these in your Vercel dashboard:
- `OPENWEATHER_API_KEY`
- `WEATHERAPI_KEY`
- `OPENCAGE_API_KEY`

## � Agricultural Intelligence

### Comprehensive Crop Database
Kisaan Mitra includes an extensive database of 70+ Indian crops across multiple categories:

#### **Cereals & Millets** 🌾
Rice, Wheat, Maize, Bajra, Jowar, Ragi, Foxtail Millet, Kodo Millet, Little Millet, Barnyard Millet

#### **Pulses** 🫘
Arhar, Chana, Masoor, Moong, Urad, Rajma, Cowpea, Field Pea, Lathyrus, Horse Gram

#### **Oilseeds** 🌻
Groundnut, Mustard, Sesame, Safflower, Niger, Sunflower, Soybean, Castor, Linseed

#### **Cash Crops** 💰
Cotton, Sugarcane, Jute, Tobacco, Indigo

#### **Vegetables** 🥬
Tomato, Potato, Onion, Cabbage, Cauliflower, Brinjal, Okra, Bottle Gourd, Ridge Gourd, Bitter Gourd, Cucumber, Watermelon, Muskmelon, Pumpkin, Carrot, Radish, Beans, Peas

#### **Fruits** 🍎
Mango, Banana, Grapes, Orange, Apple, Pomegranate, Guava, Papaya, Litchi, Coconut

#### **Spices** 🌶️
Chili, Turmeric, Coriander, Cumin, Fenugreek, Ginger, Garlic, Black Pepper, Cardamom

#### **Fodder Crops** 🌱
Berseem, Lucerne, Oats, Maize Fodder, Jowar Fodder

### Smart Recommendation Engine
- **Climate Analysis**: Matches crop requirements with current weather patterns
- **Soil Compatibility**: Considers soil moisture, temperature, and pH levels
- **Seasonal Timing**: Recommends optimal planting and harvesting windows
- **Confidence Scoring**: Each recommendation includes success probability
- **Risk Assessment**: Identifies potential challenges and mitigation strategies

## �🎯 API Endpoints

### `/api/weather`
- **Method**: GET
- **Params**: `lat`, `lon`
- **Response**: Consolidated weather and soil data
- **Caching**: 10 minutes

### `/api/geocode`
- **Method**: GET  
- **Params**: `q` (search query)
- **Response**: Location search results
- **Coverage**: India-focused

## 🧪 Features Demo

The app includes fallback demo data, so it works even without API keys for testing purposes. However, for production use, proper API keys are essential.

### Demo Locations
- Try searching: "Mumbai", "Bangalore", "Delhi", "Pune", "Chennai"
- Use GPS location for real-time local data
- Explore 14-day forecasts and soil analytics
- Test crop suggestions based on current conditions

## 🔧 Customization

### Adding New Weather APIs
1. Add API call in `/api/weather.ts`
2. Update consolidation logic
3. Implement fallback handling

### Extending Soil Analysis
- Modify soil recommendation logic
- Add new soil parameters
- Enhance ML predictions

### UI Customization
- Update color scheme in `tailwind.config.js`
- Modify animations in components
- Add new chart types with Recharts

## 📊 Performance

- **API Response Time**: <500ms average
- **Caching**: 10-minute intelligent caching
- **Mobile Performance**: Optimized for 3G networks
- **Bundle Size**: <2MB total
- **Lighthouse Score**: 95+ on all metrics

## 🛡️ Security

- **API Keys Protection**: All API keys stored in environment variables (`.env` file)
- **Git Security**: `.env` file excluded from version control via `.gitignore`
- **CORS Configuration**: Properly configured cross-origin resource sharing
- **Input Validation**: All API endpoints validate user input
- **Rate Limiting**: API calls are rate-limited to prevent abuse

### 🔐 Important Security Notes:
- ⚠️ **Never commit `.env` files** to version control
- ✅ Use `.env.example` as template with placeholder values only
- 🔄 Rotate API keys regularly for enhanced security
- 🚫 Don't expose API keys in client-side code
- 📝 Set up environment variables in your deployment platform

## 📱 Mobile Support

- Responsive design (mobile-first)
- Touch-optimized interactions
- Offline capability with cached data
- Progressive Web App features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the GitHub Issues page
2. Review API documentation links above
3. Ensure all environment variables are set correctly
4. Verify API key quotas and permissions

---

**Powered by Kisaan Mitra – Your Trusted Companion for Smart Farming & Weather Intelligence** �👨‍🌾🤝