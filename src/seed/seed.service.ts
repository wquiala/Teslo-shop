import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductsModule } from '../products/products.module';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/see-data';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed(user: User) {
    await this.deleteTables();
    const firstUser = await this.insertUsers();
    await this.insertNewProduct(firstUser);
    return `Seed executed`;
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });
    const dbUser = await this.userRepository.save(seedUsers);

    return dbUser[0];
  }

  private async insertNewProduct(user: User) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromise = [];
    products.forEach((product) => {
      insertPromise.push(this.productsService.create(product, user));
    });
    await Promise.all(insertPromise);
    return true;
  }
}
