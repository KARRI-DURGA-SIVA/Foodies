/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FoodIndexPanel from './components/FoodIndexPanel';
import Hero from './components/Hero';
import ProductSection from './components/ProductSection';
import ExploreSection from './components/ExploreSection';
import RecipeSection from './components/RecipeSection';
import MissionSection from './components/MissionSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import ProductDetailPage from './pages/ProductDetailPage';
import OrderPage from './pages/OrderPage';
import FindUsPage from './pages/FindUsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import InfoPage from './pages/InfoPage';

function HomePage() {
  return (
    <div className="min-h-screen bg-burgundy selection:bg-brand selection:text-white scroll-smooth scroll-hidden">
      {/* Dynamic Background Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-[100] mix-blend-overlay" />
      
      <Navbar />
      <FoodIndexPanel />
      
      <main className="flex flex-col">
        <Hero />
        <ExploreSection />
        <ProductSection />
        <RecipeSection />
        <MissionSection />
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={
          <>
            <Navbar />
            <FoodIndexPanel />
            <ProductDetailPage />
          </>
        } />
        <Route path="/order/:id" element={
          <>
            <Navbar />
            <FoodIndexPanel />
            <OrderPage />
          </>
        } />
        <Route path="/find-us" element={
          <>
            <Navbar />
            <FoodIndexPanel />
            <FindUsPage />
          </>
        } />
        <Route path="/search" element={
          <>
            <Navbar />
            <FoodIndexPanel />
            <SearchResultsPage />
          </>
        } />
        <Route path="/products/:category" element={
          <>
            <Navbar />
            <FoodIndexPanel />
            <InfoPage type="products" />
          </>
        } />
        <Route path="/mission" element={
          <>
            <Navbar />
            <FoodIndexPanel />
            <InfoPage type="mission" />
          </>
        } />
        <Route path="/impact" element={
          <>
            <Navbar />
            <FoodIndexPanel />
            <InfoPage type="mission" />
          </>
        } />
        <Route path="/sustainability" element={
          <>
            <Navbar />
            <FoodIndexPanel />
            <InfoPage type="mission" />
          </>
        } />
        <Route path="/nutrition" element={
          <>
            <Navbar />
            <FoodIndexPanel />
            <InfoPage type="nutrition" />
          </>
        } />
        <Route path="/ingredients" element={
          <>
            <Navbar />
            <FoodIndexPanel />
            <InfoPage type="nutrition" />
          </>
        } />
        <Route path="/allergens" element={
          <>
            <Navbar />
            <FoodIndexPanel />
            <InfoPage type="nutrition" />
          </>
        } />
        <Route path="/recipes" element={
          <>
            <Navbar />
            <FoodIndexPanel />
            <InfoPage type="recipes" />
          </>
        } />
        <Route path="/foodservice" element={
          <>
            <Navbar />
            <FoodIndexPanel />
            <InfoPage type="foodservice" />
          </>
        } />
      </Routes>
    </Router>
  );
}
