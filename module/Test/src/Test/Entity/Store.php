<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/** 
 * @ORM\Entity
 */
class Store {
    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string", length=255, nullable=true) */
	protected $code;
	
	/** @ORM\Column(type="string", length=255, unique=true) */
	protected $name;
	
	/** @ORM\Column(type="string", length=255) */
	protected $address;
	
	/** @ORM\ManyToOne(targetEntity="User") */
	protected $manager;
	
	public function getId(){
	    return $this->id;
	}
    
    public function setId($id){
    	$this->id = $id;
    }
    
    public function getCode(){
    	return $this->code;
    }
    
    public function setCode($code){
    	$this->code = $code;
    }
 
    public function getName(){
    	return $this->name;
    }
    
    public function setName($name){
    	$this->name = $name;
    }

    public function getAddress(){
    	return $this->address;
    }
    
    public function setAddress($address){
    	$this->name = $address;
    }
    
    public function getManager(){
    	return $this->manager;
    }

    public function setManager($manager){
    	$this->grants = $manager;
    }
}