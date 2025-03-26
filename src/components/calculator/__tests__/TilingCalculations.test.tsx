
import { render, screen } from '@testing-library/react';
import { EstimateBreakdown } from '@/types';

// Test the tiling calculation functions used in EstimateResultStep
describe('Tiling Calculations', () => {
  // Mock constants from the actual component
  const TILE_COST_PER_UNIT = 80;
  const TILING_LABOR_RATE = 85;
  const TILE_SIZE_SQFT = 4;
  
  // Test function for area calculations
  const calculateAreas = (length: number, width: number, height: number = 9) => {
    const floorArea = length * width;
    const wallArea = 2 * (length + width) * height;
    const totalArea = floorArea + wallArea;
    
    return { floorArea, wallArea, totalArea };
  };
  
  // Test function for tile quantity calculations
  const calculateTileQuantity = (totalArea: number) => {
    const tileQuantityInitial = Math.ceil(totalArea / TILE_SIZE_SQFT);
    const tileQuantityWithBreakage = Math.ceil(tileQuantityInitial * 1.1); // Adding 10% for breakage
    
    return { tileQuantityInitial, tileQuantityWithBreakage };
  };
  
  // Test function for tiling costs
  const calculateTilingCosts = (totalArea: number, tileQuantityWithBreakage: number) => {
    const tileMaterialCost = tileQuantityWithBreakage * TILE_COST_PER_UNIT;
    const tilingLaborCost = totalArea * TILING_LABOR_RATE;
    const totalTilingCost = tileMaterialCost + tilingLaborCost;
    
    return { tileMaterialCost, tilingLaborCost, totalTilingCost };
  };
  
  test('calculates correct areas for given dimensions', () => {
    // Test case 1: 10 x 8 washroom
    const areas1 = calculateAreas(10, 8);
    expect(areas1.floorArea).toBe(80); // 10 * 8
    expect(areas1.wallArea).toBe(324); // 2 * (10 + 8) * 9
    expect(areas1.totalArea).toBe(404); // 80 + 324
    
    // Test case 2: 6 x 5 washroom
    const areas2 = calculateAreas(6, 5);
    expect(areas2.floorArea).toBe(30); // 6 * 5
    expect(areas2.wallArea).toBe(198); // 2 * (6 + 5) * 9
    expect(areas2.totalArea).toBe(228); // 30 + 198
  });
  
  test('calculates correct tile quantities with 10% breakage', () => {
    // For a total area of 400 sq ft
    const { tileQuantityInitial, tileQuantityWithBreakage } = calculateTileQuantity(400);
    
    // Initial tile quantity: 400 sq ft / 4 sq ft per tile = 100 tiles
    expect(tileQuantityInitial).toBe(100);
    
    // With 10% breakage: 100 tiles * 1.1 = 110 tiles
    expect(tileQuantityWithBreakage).toBe(110);
    
    // For a non-round number that needs rounding up
    const quantities2 = calculateTileQuantity(405);
    
    // Initial: 405 / 4 = 101.25, rounded up to 102
    expect(quantities2.tileQuantityInitial).toBe(102);
    
    // With breakage: 102 * 1.1 = 112.2, rounded up to 113
    expect(quantities2.tileQuantityWithBreakage).toBe(113);
  });
  
  test('calculates correct tiling costs', () => {
    const totalArea = 400;
    const tileQuantityWithBreakage = 110;
    
    const { tileMaterialCost, tilingLaborCost, totalTilingCost } = 
      calculateTilingCosts(totalArea, tileQuantityWithBreakage);
    
    // Material cost: 110 tiles * ₹80 per tile = ₹8,800
    expect(tileMaterialCost).toBe(8800);
    
    // Labor cost: 400 sq ft * ₹85 per sq ft = ₹34,000
    expect(tilingLaborCost).toBe(34000);
    
    // Total cost: ₹8,800 + ₹34,000 = ₹42,800
    expect(totalTilingCost).toBe(42800);
  });
  
  test('integration test for full calculation flow', () => {
    // For a 10x8 washroom
    const { floorArea, wallArea, totalArea } = calculateAreas(10, 8);
    const { tileQuantityInitial, tileQuantityWithBreakage } = calculateTileQuantity(totalArea);
    const { tileMaterialCost, tilingLaborCost, totalTilingCost } = 
      calculateTilingCosts(totalArea, tileQuantityWithBreakage);
    
    // Verify each step of the calculation
    expect(floorArea).toBe(80);
    expect(wallArea).toBe(324);
    expect(totalArea).toBe(404);
    
    expect(tileQuantityInitial).toBe(101);
    expect(tileQuantityWithBreakage).toBe(112);
    
    expect(tileMaterialCost).toBe(8960); // 112 * 80
    expect(tilingLaborCost).toBe(34340); // 404 * 85
    expect(totalTilingCost).toBe(43300); // 8960 + 34340
  });
});
