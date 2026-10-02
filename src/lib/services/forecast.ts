import { Product } from '@/types/database';
import { SaleWithDetails } from './sales';

export interface ProductStockForecast {
  product: Product;
  dailyVelocity: number; // units sold per day
  daysUntilRunout: number; // estimated days remaining
  estimatedRunoutDate: string; // ISO date string
  demandTrend: 'high' | 'moderate' | 'low';
  reorderRecommendation: string;
}

export interface RevenueForecastPoint {
  date: string;
  projectedRevenue: number;
  isProjected: boolean;
}

export function calculateForecasts(
  products: Product[],
  sales: SaleWithDetails[]
) {
  // 1. Calculate Daily Sales Velocity for each product over past 14 days
  const now = Date.now();
  const pastDays = 14;

  const productUnitsSoldMap: { [productId: string]: number } = {};
  sales.forEach((s) => {
    s.items?.forEach((it) => {
      productUnitsSoldMap[it.product_id] =
        (productUnitsSoldMap[it.product_id] || 0) + it.quantity;
    });
  });

  const productForecasts: ProductStockForecast[] = products.map((prod) => {
    const totalSold = productUnitsSoldMap[prod.id] || 0;
    const dailyVelocity = parseFloat((totalSold / pastDays).toFixed(2));
    
    let daysUntilRunout = 999;
    if (dailyVelocity > 0) {
      daysUntilRunout = Math.max(1, Math.round(prod.stock_quantity / dailyVelocity));
    } else if (prod.stock_quantity === 0) {
      daysUntilRunout = 0;
    }

    const runoutDate = new Date(now + Math.min(daysUntilRunout, 365) * 24 * 60 * 60 * 1000);
    const dateFormatted = runoutDate.toISOString().split('T')[0];

    let demandTrend: 'high' | 'moderate' | 'low' = 'moderate';
    if (dailyVelocity >= 0.8) demandTrend = 'high';
    else if (dailyVelocity === 0 || dailyVelocity <= 0.3) demandTrend = 'low';

    let reorderRecommendation = 'Stock adequate for current recorded demand.';
    if (prod.stock_quantity === 0) {
      reorderRecommendation = `OUT OF STOCK: Reorder minimum ${Math.max(10, prod.minimum_stock * 2)} units immediately.`;
    } else if (prod.stock_quantity <= prod.minimum_stock) {
      reorderRecommendation = `LOW STOCK WARNING: Stock is below reorder threshold (${prod.minimum_stock}).`;
    } else if (daysUntilRunout <= 7 && dailyVelocity > 0) {
      reorderRecommendation = `Plan replenishment within ${daysUntilRunout} days based on sales velocity.`;
    }

    return {
      product: prod,
      dailyVelocity,
      daysUntilRunout,
      estimatedRunoutDate: dateFormatted,
      demandTrend,
      reorderRecommendation,
    };
  });

  // Sort by earliest runout
  productForecasts.sort((a, b) => a.daysUntilRunout - b.daysUntilRunout);

  // 2. Moving Average Sales Projection for the next 7 days based strictly on actual sales
  const totalRecentRevenue = sales.reduce((acc, s) => acc + s.total_amount, 0);
  const avgDailyRevenue = totalRecentRevenue > 0 ? Math.round(totalRecentRevenue / 7) : 0;

  const revenueForecast: RevenueForecastPoint[] = [];
  // Past 4 days actuals
  for (let i = 4; i >= 1; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000);
    const dayStr = d.toISOString().split('T')[0];
    const dayRev = sales
      .filter((s) => new Date(s.created_at).toISOString().split('T')[0] === dayStr)
      .reduce((acc, s) => acc + s.total_amount, 0);

    revenueForecast.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      projectedRevenue: dayRev,
      isProjected: false,
    });
  }

  // Today
  const todayStr = new Date(now).toISOString().split('T')[0];
  const todayRev = sales
    .filter((s) => new Date(s.created_at).toISOString().split('T')[0] === todayStr)
    .reduce((acc, s) => acc + s.total_amount, 0);

  revenueForecast.push({
    date: 'Today',
    projectedRevenue: todayRev,
    isProjected: false,
  });

  // Next 5 days projections based on actual moving average
  for (let i = 1; i <= 5; i++) {
    const d = new Date(now + i * 24 * 60 * 60 * 1000);
    revenueForecast.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      projectedRevenue: avgDailyRevenue > 0 ? Math.round(avgDailyRevenue * (1 + i * 0.02)) : 0,
      isProjected: true,
    });
  }

  return { productForecasts, revenueForecast, avgDailyRevenue };
}
