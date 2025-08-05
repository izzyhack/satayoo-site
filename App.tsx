import React, { useState } from 'react';
import { ShoppingCart, Check, Star, Users, Target, Zap, Brain, Cog, Shield, ArrowRight, Play, CheckCircle, Sparkles, Github, Code, Heart, Award, TrendingUp, MessageCircle, ChevronDown, ChevronUp, Calculator, Clock, DollarSign, TrendingUp as Growth, Sun, Activity, Smartphone, TreePine } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { Alert, AlertDescription } from './components/ui/alert';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

import { Badge } from './components/ui/badge';
import { Slider } from './components/ui/slider';
import { projectId, publicAnonKey } from './utils/supabase/info';

// Import the tennis robot images
import robotActionImage from 'figma:asset/074c35c7f36b2c56197e65f081f4111a1c6a56a4.png';
import robotAnimationGif from 'figma:asset/6cd97e44b603575e063797850025ed1bac113428.png';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-1ec6f4bd`;

export default function App() {
  const [orderForm, setOrderForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    message: ''
  });
  const [orderStatus, setOrderStatus] = useState<{
    loading: boolean;
    success: boolean;
    error: string | null;
    orderId?: string;
  }>({
    loading: false,
    success: false,
    error: null
  });

  // Wellness Calculator State
  const [wellnessInputs, setWellnessInputs] = useState({
    dailyScreenTime: 6,
    desiredActiveTime: 2,
    playersInFamily: 2,
    weeksPerYear: 40
  });

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderStatus({ loading: true, success: false, error: null });

    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(orderForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      setOrderStatus({
        loading: false,
        success: true,
        error: null,
        orderId: data.orderId
      });

      // Reset form
      setOrderForm({ name: '', email: '', phone: '', organization: '', message: '' });
    } catch (error) {
      console.error('Order submission error:', error);
      setOrderStatus({
        loading: false,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to place order. Please try again.'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setOrderForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Wellness Calculations
  const calculateWellness = () => {
    const { dailyScreenTime, desiredActiveTime, playersInFamily, weeksPerYear } = wellnessInputs;
    
    const weeklyActiveTime = desiredActiveTime * 7 * playersInFamily;
    const yearlyActiveTime = weeklyActiveTime * weeksPerYear;
    const weeklyCaloriesBurned = weeklyActiveTime * 400;
    
    return {
      weeklyActiveTime,
      yearlyActiveTime,
      weeklyCaloriesBurned,
      weeklyOutdoorTime: weeklyActiveTime,
    };
  };

  const wellnessResults = calculateWellness();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl text-black font-bold">Satayoo Labs</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#demo" className="text-gray-600 hover:text-black transition-colors">Demo</a>
              <a href="#calculator" className="text-gray-600 hover:text-black transition-colors">Calculator</a>
              <a href="#opensource" className="text-gray-600 hover:text-black transition-colors">Open Source</a>
              <a href="#pricing" className="text-gray-600 hover:text-black transition-colors">Order</a>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild className="btn-convert">
                <a href="#pricing">Order Now</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl leading-tight mb-6">
                The Future of Tennis Gaming
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                AI tennis partner that plays WITH you. Real matches, points, and adaptive gameplay.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" asChild className="text-lg px-8 btn-convert">
                  <a href="#pricing">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Order for $5,000
                  </a>
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Free shipping
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  90-day guarantee
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  24/7 support
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={robotActionImage}
                alt="TennisBot Pro in action on tennis court"
                className="w-full h-96 max-w-lg mx-auto rounded-2xl shadow-2xl object-contain"
              />
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg">
                <span className="text-lg">New!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROBOT IN ACTION SECTION */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl lg:text-6xl leading-tight mb-6">
              Your Ultimate Game Partner
            </h2>
            <p className="text-2xl opacity-90 max-w-3xl mx-auto">
              Real tennis gameplay with adaptive AI. This is gaming, not practice.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 border border-white border-opacity-20">
              <div className="relative">
                <img 
                  src={robotAnimationGif}
                  alt="TennisBot Pro robotic arm demonstration - Live action"
                  className="w-full h-96 rounded-2xl shadow-2xl object-contain bg-white"
                />
                <div className="absolute -top-3 -right-3 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
                  <span className="text-sm uppercase tracking-wide">● LIVE</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8 text-center">
                <div className="bg-white bg-opacity-20 rounded-xl p-6">
                  <div className="text-lg opacity-90">Real Match Play</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-6">
                  <div className="text-lg opacity-90">Score Tracking</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-6">
                  <div className="text-lg opacity-90">Adaptive Gameplay</div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Button size="lg" asChild className="btn-convert text-lg px-12 py-4">
                  <a href="#pricing">
                    <ShoppingCart className="mr-2 h-6 w-6" />
                    GET YOURS NOW - $5,000
                  </a>
                </Button>
                <p className="text-sm mt-4 opacity-75">⚡ Limited stock!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl leading-tight mb-12">
                Tennis Gaming. Revolutionized.
              </h2>
              <Button size="lg" asChild className="btn-convert text-lg px-8">
                <a href="#pricing">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Get Your Game Partner
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Wellness Calculator Section */}
      <section id="calculator" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full mb-6">
              <Sun className="h-5 w-5" />
              <span className="text-lg uppercase tracking-wide text-white">Wellness Calculator</span>
            </div>
            <h2 className="text-4xl lg:text-5xl leading-tight mb-6">
              Screen Time to Game Time
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Calculate your family's active time transformation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Calculator Inputs */}
            <Card className="border-2 border-green-200 bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Your Lifestyle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <Label className="text-base mb-3 block">Daily Screen Time: <span className="text-2xl text-red-600">{wellnessInputs.dailyScreenTime}h</span></Label>
                  <Slider
                    value={[wellnessInputs.dailyScreenTime]}
                    onValueChange={(value) => setWellnessInputs(prev => ({ ...prev, dailyScreenTime: value[0] }))}
                    max={12}
                    min={2}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-base mb-3 block">Desired Active Time: <span className="text-2xl text-green-600">{wellnessInputs.desiredActiveTime}h</span></Label>
                  <Slider
                    value={[wellnessInputs.desiredActiveTime]}
                    onValueChange={(value) => setWellnessInputs(prev => ({ ...prev, desiredActiveTime: value[0] }))}
                    max={4}
                    min={0.5}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-base mb-3 block">Family Members: <span className="text-2xl text-blue-600">{wellnessInputs.playersInFamily}</span></Label>
                  <Slider
                    value={[wellnessInputs.playersInFamily]}
                    onValueChange={(value) => setWellnessInputs(prev => ({ ...prev, playersInFamily: value[0] }))}
                    max={6}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-base mb-3 block">Active Weeks/Year: <span className="text-2xl text-blue-600">{wellnessInputs.weeksPerYear}</span></Label>
                  <Slider
                    value={[wellnessInputs.weeksPerYear]}
                    onValueChange={(value) => setWellnessInputs(prev => ({ ...prev, weeksPerYear: value[0] }))}
                    max={52}
                    min={20}
                    step={2}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Sun className="h-5 w-5" />
                    Your Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl text-blue-600 mb-1">{Math.round(wellnessResults.weeklyActiveTime)}h</div>
                      <div className="text-sm text-gray-600">Active Time/Week</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl text-orange-600 mb-1">{Math.round(wellnessResults.weeklyCaloriesBurned).toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Calories/Week</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-xl text-green-600 mb-1">{Math.round(wellnessResults.yearlyActiveTime)}h</div>
                    <div className="text-sm text-gray-600">Annual Active Hours</div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button size="lg" asChild className="btn-convert text-lg px-8">
                  <a href="#pricing">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Start Gaming - $5,000
                  </a>
                </Button>
                <p className="text-sm text-gray-600 mt-3">
                  🌟 Transform your family's activity level!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section id="opensource" className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-black bg-opacity-30 rounded-full px-6 py-3 mb-6 border border-white border-opacity-30">
              <Github className="h-5 w-5 text-white" />
              <span className="text-lg uppercase tracking-wide text-white">Open Source</span>
            </div>
            <h2 className="text-4xl lg:text-5xl leading-tight mb-6">
              Built in the Open
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Complete transparency. TennisBot Pro's software is open source.
            </p>
          </div>
          

          
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
              <h3 className="text-2xl mb-4">Why Open Source</h3>
              <p className="text-lg opacity-90 mb-6">
                "Robotics should be accessible to everyone. Open source builds trust."
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <div>Izzy Hack</div>
                  <div className="text-sm opacity-75">CEO & Founder</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <Card className="border-4 border-blue-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white py-2">
              <span className="text-sm">Launch Price</span>
            </div>
            <CardHeader className="pt-12">
              <CardTitle className="text-3xl">TennisBot Pro</CardTitle>
              <div className="text-6xl text-blue-600 my-6">
                $5,000
                <span className="text-xl text-gray-500 ml-2">USD</span>
              </div>
              <CardDescription className="text-lg">
                Complete tennis gaming system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>TennisBot Pro Hardware</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>AI Gaming Software</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>Professional Setup</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>1-Year Warranty</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>90-Day Guarantee</span>
              </div>
              
              <div className="pt-6">
                <Button size="lg" asChild className="w-full text-lg py-6 btn-convert">
                  <a href="mailto:izzyhack@gmail.com?subject=TennisBot Pro Order - $5,000&body=I'm ready to order my TennisBot Pro for $5,000. Please contact me to arrange payment and delivery.">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Order Now
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-6">Ready to Level Up?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join the tennis gaming revolution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 btn-convert">
              <a href="#pricing">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Order Now - $5,000
              </a>
            </Button>
            <Button size="lg" asChild className="text-lg px-8 bg-white text-blue-600 hover:bg-gray-100">
              <a href="mailto:izzyhack@gmail.com">
                Contact Us
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-black" />
                </div>
                <span className="text-xl">Satayoo Labs</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing tennis through AI gaming.
              </p>
            </div>
            <div>
              <h4 className="text-lg mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>Email: izzyhack@gmail.com</p>
                <p>Phone: +972542552903</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#demo" className="block text-gray-400 hover:text-white transition-colors">Demo</a>
                <a href="#calculator" className="block text-gray-400 hover:text-white transition-colors">Calculator</a>
                <a href="#pricing" className="block text-gray-400 hover:text-white transition-colors">Order</a>
              </div>
            </div>
            <div>
              <h4 className="text-lg mb-4">Community</h4>
              <div className="space-y-2">
                <a href="#opensource" className="block text-gray-400 hover:text-white transition-colors">Open Source</a>
                <a href="https://github.com/satayoo-labs/tennisbot-pro" className="block text-gray-400 hover:text-white transition-colors">GitHub</a>
                <a href="mailto:izzyhack@gmail.com" className="block text-gray-400 hover:text-white transition-colors">Support</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Satayoo Labs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}