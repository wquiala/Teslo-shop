import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProductsModule } from '../products/products.module';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/see-data';

@Injectable()
export class SeedService {
  constructor(
    
    private readonly productsService: ProductsService,
  ){

  }
  
  async runSeed() {
    await this.insertNewProduct();
    return `Seed executed`;
  }

  private async insertNewProduct(){
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromise=[];
    products.forEach(product=> {
      insertPromise.push(this.productsService.create(product));
      
    });
    await Promise.all(insertPromise);
    return true;
  }

  
}
