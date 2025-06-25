/**
 * @fileoverview Base entity class providing common database fields.
 * Contains timestamp fields for tracking entity creation, updates, and soft deletion.
 */

import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

/**
 * Base entity class that provides common timestamp fields for all entities.
 * All domain entities should extend this class to inherit audit fields.
 * 
 * @abstract
 * @class BaseEntity
 */
export abstract class BaseEntity {
  /**
   * Timestamp when the entity was created.
   * Automatically set by TypeORM on entity creation.
   * 
   * @type {Date}
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * Timestamp when the entity was last updated.
   * Automatically updated by TypeORM on entity modification.
   * 
   * @type {Date}
   */
  @UpdateDateColumn()
  updatedAt!: Date;

  /**
   * Timestamp when the entity was soft deleted.
   * Null if the entity is not deleted (soft delete pattern).
   * 
   * @type {Date | undefined}
   */
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}